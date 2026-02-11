from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from bson import ObjectId
from model import load_model
from readiness import readiness

app = Flask(__name__)
CORS(app)

client = MongoClient("mongodb://localhost:27017/")
db = client["cpris"]

students = db.students
companies = db.companies

model = load_model()


# ---------------- HOME ----------------
@app.route("/")
def home():
    return "CPRIS Running 🚀"


# ---------------- ADD STUDENT ---------------
@app.route("/students", methods=["POST"])
def add_student():
    data = request.json

    # -------- auto register skills --------
    for skill in data.get("skills", []):
        exists = db.skills.find_one({"name": skill})
        if not exists:
            db.skills.insert_one({"name": skill})

    students.insert_one(data)

    return jsonify({"msg": "student added"})


# ---------------- GET STUDENTS ----------------
@app.route("/students", methods=["GET"])
def get_students():
    out = []
    for s in students.find():
        s["_id"] = str(s["_id"])
        out.append(s)
    return jsonify(out)

# ---------------- UPDATE STUDENT ----------------
@app.route("/students/<id>", methods=["PUT"])
def update_student(id):
    data = request.json

    # auto add skills
    for skill in data.get("skills", []):
        exists = db.skills.find_one({"name": skill})
        if not exists:
            db.skills.insert_one({"name": skill})

    students.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return jsonify({"msg": "student updated"})


# ---------------- DELETE STUDENT ----------------
@app.route("/students/<id>", methods=["DELETE"])
def delete_student(id):
    students.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "deleted"})


# ---------------- STUDENT REPORT ----------------
@app.route("/student/<id>", methods=["GET"])
def student_report(id):
    s = students.find_one({"_id": ObjectId(id)})

    prob = model.predict_proba([[
        s["cgpa"],
        s["coding_score"],
        s["aptitude_score"],
        s["projects"],
        s["internships"]
    ]])[0][1]

    return jsonify({
        "name": s["name"],
        "department": s["department"],
        "readiness": readiness(s),
        "probability": round(prob * 100, 2),
        "skills": s["skills"]
    })


# ---------------- ADD COMPANY ----------------
@app.route("/companies", methods=["POST"])
def add_company():

    data = request.json

    # -------- auto register skills --------
    for skill in data.get("skills", []):
        exists = db.skills.find_one({"name": skill})
        if not exists:
            db.skills.insert_one({"name": skill})

    res = companies.insert_one(data)

    return jsonify({
        "msg": "company added",
        "id": str(res.inserted_id)
    })

# ---------------- GET COMPANIES ----------------
@app.route("/companies", methods=["GET"])
def get_companies():
    result = []
    for c in companies.find():
        c["_id"] = str(c["_id"])
        result.append(c)
    return jsonify(result)


# ---------------- UPDATE COMPANY ----------------
@app.route("/companies/<id>", methods=["PUT"])
def update_company(id):

    data = request.json

    # -------- auto register skills --------
    for skill in data.get("skills", []):
        exists = db.skills.find_one({"name": skill})
        if not exists:
            db.skills.insert_one({"name": skill})

    companies.update_one(
        {"_id": ObjectId(id)},
        {"$set": data}
    )

    return jsonify({"msg": "company updated"})


# ---------------- DELETE COMPANY ----------------
@app.route("/companies/<id>", methods=["DELETE"])
def delete_company(id):
    companies.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "deleted"})


# ---------------- COMPANY ANALYSIS ----------------
@app.route("/analyze/company/<name>")
def analyze_company(name):

    c = companies.find_one({"name": name})

    if not c:
        return jsonify({"error": "Company not found"}), 404

    total = students.count_documents({})
    ready = 0
    gaps = {}

    for s in students.find():

        ok = True

        if s["cgpa"] < c["min_cgpa"]:
            ok = False

        if s["coding_score"] < c["coding_cutoff"]:
            ok = False

        for skill in c["skills"]:
            if skill not in s["skills"]:
                gaps[skill] = gaps.get(skill, 0) + 1
                ok = False

        if ok:
            ready += 1

    percent = round((ready/total)*100,2) if total else 0

    return jsonify({
        "company": c["name"],
        "eligible": ready,
        "percent": percent,
        "gaps": gaps
    })

@app.route("/dashboard/summary")
def dashboard_summary():

    skill_stats = {}
    company_stats = []

    total = students.count_documents({})

    # ---------- skill readiness ----------
    for s in students.find():
        for skill in s["skills"]:
            skill_stats[skill] = skill_stats.get(skill, 0) + 1

    skill_percent = []
    for k,v in skill_stats.items():
        skill_percent.append({
            "skill": k,
            "percent": round((v/total)*100,2)
        })


    # ---------- company readiness ----------
    for c in companies.find():
        ready = 0

        for s in students.find():
            if s["cgpa"] >= c["min_cgpa"] and s["coding_score"] >= c["coding_cutoff"]:
                if set(c["skills"]).issubset(set(s["skills"])):
                    ready += 1

        company_stats.append({
            "company": c["name"],
            "percent": round((ready/total)*100,2)
        })


    return jsonify({
        "skills": skill_percent,
        "companies": company_stats
    })

@app.route("/skills", methods=["POST"])
def add_skill():
    res = db.skills.insert_one(request.json)
    return jsonify({"msg": "skill added", "id": str(res.inserted_id)})


@app.route("/skills", methods=["GET"])
def get_skills():
    out = []
    for s in db.skills.find():
        s["_id"] = str(s["_id"])
        out.append(s)
    return jsonify(out)


@app.route("/skills/<id>", methods=["PUT"])
def update_skill(id):
    db.skills.update_one(
        {"_id": ObjectId(id)},
        {"$set": request.json}
    )
    return jsonify({"msg": "updated"})


@app.route("/skills/<id>", methods=["DELETE"])
def delete_skill(id):
    db.skills.delete_one({"_id": ObjectId(id)})
    return jsonify({"msg": "deleted"})

@app.route("/dashboard/skill/<skill>")
def skill_dashboard(skill):

    total_students = students.count_documents({})
    have_skill = students.count_documents({"skills": skill})

    total_companies = companies.count_documents({})
    company_need = companies.count_documents({"skills": skill})

    return jsonify({
        "skill": skill,
        "students_percent": round((have_skill/total_students)*100,2) if total_students else 0,
        "companies_need": company_need,
        "total_companies": total_companies
    })

@app.route("/dashboard/skills")
def skills_dashboard():

    skills_param = request.args.get("skills", "")
    min_cgpa = request.args.get("min_cgpa")
    coding = request.args.get("coding")
    aptitude = request.args.get("aptitude")   # ⭐ NEW

    # convert numbers safely
    min_cgpa = float(min_cgpa) if min_cgpa else None
    coding = float(coding) if coding else None
    aptitude = float(aptitude) if aptitude else None   # ⭐ NEW

    # make skills list
    skills = [s.strip().lower() for s in skills_param.split(",") if s.strip()]

    total = students.count_documents({})
    matched_students = 0


    # =================================================
    # STUDENT FILTERING
    # =================================================
    for s in students.find():

        # CGPA
        if min_cgpa is not None and s.get("cgpa", 0) < min_cgpa:
            continue

        # Coding
        if coding is not None and s.get("coding_score", 0) < coding:
            continue

        # Aptitude ⭐
        if aptitude is not None and s.get("aptitude_score", 0) < aptitude:
            continue

        # Skills
        if skills:
            student_skills = [x.lower() for x in s.get("skills", [])]

            if not any(skill in student_skills for skill in skills):
                continue

        matched_students += 1


    percent = round((matched_students / total) * 100, 2) if total else 0


    # =================================================
    # COMPANIES REQUIRING THESE SKILLS
    # =================================================
    companies_list = []

    if skills:
        for c in companies.find():

            company_skills = [x.lower() for x in c.get("skills", [])]

            if any(skill in company_skills for skill in skills):
                companies_list.append({
                    "name": c.get("name"),
                    "role": c.get("role")
                })


    return jsonify({
        "skills": skills,
        "students_count": matched_students,
        "students_percent": percent,
        "companies_need": companies_list
    })

@app.route("/dashboard/skill-distribution")
def skill_distribution():

    total = students.count_documents({})
    result = []

    for sk in db.skills.find():
        name = sk["name"]
        count = students.count_documents({"skills": name})

        result.append({
            "skill": name,
            "count": count,
            "percent": round((count/total)*100,2) if total else 0
        })

    return jsonify(result)

@app.route("/dashboard/company-readiness")
def company_readiness():

    total_students = students.count_documents({})
    result = []

    for c in companies.find():

        eligible = 0
        gaps = {
            "cgpa": 0,
            "coding": 0,
            "skills": {}
        }

        for s in students.find():

            ok = True

            # cgpa
            if s["cgpa"] < c["min_cgpa"]:
                gaps["cgpa"] += 1
                ok = False

            # coding
            if s["coding_score"] < c["coding_cutoff"]:
                gaps["coding"] += 1
                ok = False

            # skills
            for skill in c["skills"]:
                if skill not in s["skills"]:
                    gaps["skills"][skill] = gaps["skills"].get(skill, 0) + 1
                    ok = False

            if ok:
                eligible += 1


        percent = round((eligible / total_students) * 100, 2) if total_students else 0

        result.append({
            "company": c["name"],
            "eligible": eligible,
            "percent": percent,
            "gaps": gaps
        })

    return jsonify(result)



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000, debug=True)
