# importing packages
from fastapi import FastAPI
import pandas as pd
import numpy as np
from fastapi.middleware.cors import CORSMiddleware

# instantiating the API
app = FastAPI()

# fixing CORS
origins = [
    "http://161.35.18.62:8080",
    "http://161.35.18.62:8000",
    "http://161.35.18.62:8123",
    "http://127.0.0.1:8000",
    "http://127.0.0.1",
    "https://trek.jani.codes"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# reading in csvs
lines = pd.read_csv("content/_test_lines_all_captains.csv")
correct_answers = pd.read_csv("content/_test_answers_all_captains.csv")
model_answers = pd.read_csv("content/_model_answers.csv")

# selecting content for the API
lines = lines["line"]
correct_answers = correct_answers["character"]
model_answers = model_answers["0"]


# creating the dictionary
test_lines_dict = {}

for num in range(len(lines)):
    test_lines_dict[str(num)] = {
            "line" : lines[num],
            "correct_char": correct_answers[num],
            "model_guess": model_answers[num],
            }

# test_lines_dict = {
#                 "0" : {
#                     "line" : "Shut up Wesley",
#                     "correct_char" : "picard",
#                     "model_guess" : "janeway"
#                                 },
#                 "1" : {
#                     "line" : "There's coffee in that nebula",
#                     "correct_char" : "janeway",
#                     "model_guess" : "janeway"
#                                 },
#                 "2" : {
#                     "line" : "Beam us up, Scotty",
#                     "correct_char" : "kirk",
#                     "model_guess" : "kirk"                }
#                  }


# creating possible API calls
@app.get("/")
async def root():
    return test_lines_dict

@app.get("/items/{item_id}")
async def read_item(item_id: str):
    return test_lines_dict[item_id]
