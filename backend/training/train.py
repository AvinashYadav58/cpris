# import pandas as pd
# from sklearn.linear_model import LogisticRegression
# import joblib
# import os

# df = pd.read_csv("data.csv")

# companies = df["company"].unique()

# os.makedirs("../models", exist_ok=True)

# for company in companies:

#     cdf = df[df["company"] == company]

#     X = cdf.drop(["company", "selected"], axis=1)
#     y = cdf["selected"]

#     model = LogisticRegression(max_iter=200)
#     model.fit(X, y)

#     joblib.dump(model, f"../models/{company}.pkl")

#     print("trained:", company)

import pandas as pd
from sklearn.linear_model import LogisticRegression
import joblib
import os

# read dataset
df = pd.read_csv("data.csv")

companies = df["company"].unique()

os.makedirs("../models", exist_ok=True)

for company in companies:

    cdf = df[df["company"] == company]

    # remove non-features
    X = cdf.drop(["company", "selected"], axis=1)
    y = cdf["selected"]

    model = LogisticRegression(max_iter=500)
    model.fit(X, y)

    # ⭐ SAVE MODEL + COLUMN ORDER
    joblib.dump({
        "model": model,
        "columns": X.columns.tolist()
    }, f"../models/{company}.pkl")

    print("trained:", company)

print("\nTraining completed ✅")
