from flask import Flask, request, jsonify
import uuid
from langchain.document_loaders import TextLoader
from langchain.indexes import VectorstoreIndexCreator
import constants

from google.cloud import texttospeech
import os, json
import openai
from typing import Tuple
from flask_cors import CORS, cross_origin

import io
import pydub
import ffmpeg

app = Flask(__name__)
cors = CORS(app)

openai.api_key = constants.OPEN_AI_KEY
os.environ["OPENAI_API_KEY"] = constants.OPEN_AI_KEY

app = Flask(__name__)
host = '127.0.0.1'
port = 8080
db = {}
loader = TextLoader('resources/jio.txt')
index = VectorstoreIndexCreator().from_loaders([loader])

@app.route('/healthcheck')
def hello_world():
    return 'Team Ode to Code goes to Dubai'


@app.route('/query', methods=['POST'])
def raise_query():
    print("here")
    session_id = request.headers.get("session-id")
    print(session_id)
    # print(session_id)
    # print(str(request.files.keys()))
    # print(str(request.form.keys()))
    # print(str(request.get_json()))
    text = None
    print(request)
    if 'audio' in request.files:
        text = convert_audio_to_text(request.files['audio'])

    elif 'text' in request.get_json():
        text = request.json['text']
    else:
        return jsonify({'message': 'No file part in the request'}), 400
    print(f"Incoming text: {text}")
    translated_text, language = translate_to_english(text)
    if translated_text:
        english_response, category = append_user_query_to_conversation(session_id, translated_text)
        regional_response = translate_from_english(f"{language};{english_response}")
        # convert_text_to_audio(language+"-IN", regional_response)
        return jsonify({'category': category, 'message': regional_response}), 200
    else:
        return jsonify({'message': 'Could not understand/translate the message, please try again'}), 200


@app.route('/createSession', methods=['POST'])
def create_session():
    session_uuid = str(uuid.uuid1())
    db[session_uuid] = ""
    return session_uuid


@app.route('/activeSessions', methods=['GET'])
def get_all_active_sessions():
    return str(db.keys())


def convert_audio_to_text(audio_file) -> str:
    audio_file.save("input.mp3")
    audio = open("input.mp3", "rb")
    transcription = openai.Audio.transcribe("whisper-1", audio)
    audio.close()
    os.remove('input.mp3')
    return transcription.text.strip()

def translate_to_english(text) -> Tuple[str, str]:
    prompt = f"""Assume you are a assistant that translates source language to English. 
    Response should have the source language in BCP-47 format and then the translation in English.
    Dont use your brain, just translate.
    Q: what is going on
    A: en, what is going on
    
    Q: nenu chaala manchi manishini
    A: te, I am a very good human
    
    Q: {text}
    A:
    """
    translate_response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=constants.MAX_TOKENS,
        temperature=0,
    )
    try:
        split_values = translate_response.choices[0].text.strip().split(",")
        language = str(split_values[0])
        if language.startswith("ur"):
            language = "hi"
        english_text = split_values[1].strip()
    except Exception as e:
        print(f"ERROR: Translated text by model:<{translate_response.choices[0].message.content.strip()}>")
        english_text = None
        language = "en"
    print(f"English_text:{english_text}")
    return english_text, language

def translate_from_english(text) -> str:
    print(f"Text for translation:{text}")
    prompt = f"""Assume you are a assistant that translates English to target language. 
    Target language is specified in BCP-47 format as first two characters.
    Dont translate if already in English
    Q: en;what is going on
    A: what is going on
    
    Q: te;I am a very good human
    A: నేను ఒక చాలా మంచి మానవుడు
    
    Q: {text}
    A:
    """
    reverse_translate_response = openai.Completion.create(
        model="text-davinci-003",
        prompt=prompt,
        max_tokens=constants.MAX_TOKENS,
        temperature=0,
    )
    print(f"Translated to regional:<{reverse_translate_response.choices[0].text}>")
    return reverse_translate_response.choices[0].text.strip()


def append_user_query_to_conversation(session_id: str, text: str) -> Tuple[str, str]:
    try:
        # conversation = db.get(session_id)
        conversation = db.get(session_id)
        if not conversation:
            conversation = f"""You are a helpful and knowledgeable customer service assistant.  
            Below are the categories which the request can be a part of.
            {constants.JIO_CATEGORIES_AND_SAMPLE_QA}   
            Send the response in json format.
            If you dont understand, send category as Others.
            """
            conversation += f"\nCustomer: {text}"
            query_conversation = conversation + """\nAssistant: {"Category": {}, "Solution": {}}"""
        else:
            conversation += f"\nCustomer: {text}"
            query_conversation = conversation + """\nAssistant: {"Category": {}, "Solution": {}}"""
        # print(f"Input to the model: {text}")
        # print(f"Input to the model(conversation): {conversation}")
        model_response = index.query(query_conversation)
        print(f"Response from the model: {model_response}")
        model_json = json.loads(model_response)
        conversation += str("\nAssistant: ") + str(model_json)
        db[session_id] = conversation
        print(conversation)
        print("\n------------------\n")
        return model_json["Solution"], model_json["Category"]
    except Exception as e:
        return "I am unable to answer this. Our executive will reach out to you within 2 hours.", "Others"
#shree
def classify_query(query: str) -> str:
    pass




if __name__ == '__main__':
    app.run(host, port)
    #initialise all models

