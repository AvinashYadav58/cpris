import joblib
import os
import pandas as pd

MODEL_DIR = "./models"


# =============================================
# Load model + columns
# =============================================
def load_model(company):
    path = os.path.join(MODEL_DIR, f"{company}.pkl")
    if not os.path.exists(path):
        return None, None

    data = joblib.load(path)

    # new format -> dict
    if isinstance(data, dict):
        return data["model"], data["columns"]

    # old format -> only model (fallback)
    return data, None


# =============================================
# Convert student → feature vector
# =============================================
def build_features(student, all_skills, columns=None):

    row = {}

    row["cgpa"] = student.get("cgpa", 0)
    row["coding_score"] = student.get("coding_score", 0)
    row["aptitude_score"] = student.get("aptitude_score", 0)
    row["internships"] = student.get("internships", 0)
    row["projects"] = student.get("projects", 0)

    sskills = [x.lower() for x in student.get("skills", [])]

    for sk in all_skills:
        row[f"skill_{sk}"] = 1 if sk.lower() in sskills else 0

    # convert to dataframe
    X = pd.DataFrame([row])

    # match training column order
    if columns:
        X = X.reindex(columns=columns, fill_value=0)

    return X


# =============================================
# Prediction
# =============================================
def predict(company, student, all_skills):
    model, columns = load_model(company)

    if not model:
        return None

    X = build_features(student, all_skills, columns)

    prob = model.predict_proba(X)[0][1]

    return round(prob * 100, 2)


# =============================================
# GAP ANALYSIS
# =============================================
def analyze_gaps(student, company):

    strong = []
    gaps = []

    # CGPA
    if student.get("cgpa", 0) >= company.get("min_cgpa", 0):
        strong.append("CGPA")
    else:
        gaps.append("Low CGPA")

    # Coding
    if student.get("coding_score", 0) >= company.get("coding_cutoff", 0):
        strong.append("Coding")
    else:
        gaps.append("Improve Coding")

    # Aptitude
    if student.get("aptitude_score", 0) >= company.get("aptitude_cutoff", 0):
        strong.append("Aptitude")
    else:
        gaps.append("Improve Aptitude")

    # Skills
    sskills = [x.lower() for x in student.get("skills", [])]
    cskills = [x.lower() for x in company.get("skills", [])]

    missing = [s for s in cskills if s not in sskills]

    if missing:
        gaps.append("Missing Skills: " + ", ".join(missing))
    else:
        strong.append("Required Skills")

    return strong, gaps
