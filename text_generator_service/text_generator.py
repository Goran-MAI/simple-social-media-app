from fastapi import FastAPI
from pydantic import BaseModel
from transformers import GPT2LMHeadModel, GPT2Tokenizer
from fastapi.middleware.cors import CORSMiddleware
import torch

app = FastAPI()

# --- CORS Middleware konfigurieren ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],      # für Entwicklung, später besser auf die Frontend-URL setzen
    allow_credentials=True,
    allow_methods=["*"],      # erlaubt POST, GET, OPTIONS, etc.
    allow_headers=["*"],
)

# Model laden
model_name = "gpt2"
tokenizer = GPT2Tokenizer.from_pretrained(model_name)
tokenizer.pad_token = tokenizer.eos_token

model = GPT2LMHeadModel.from_pretrained(model_name)
model.config.pad_token_id = tokenizer.eos_token_id

class GenerateRequest(BaseModel):
    prompt: str
    max_length: int = 50

@app.post("/generate_text")
async def generate_text(request: GenerateRequest):
    inputs = tokenizer(
        request.prompt,
        return_tensors="pt",
        padding=True,
        truncation=True
    )

    outputs = model.generate(
        **inputs,
        max_length=request.max_length,
        pad_token_id=tokenizer.eos_token_id,
        do_sample=True,
        temperature=0.8,
        repetition_penalty=1.2,
        top_k=50,
        top_p=0.95
    )
    generated_text = tokenizer.decode(outputs[0], skip_special_tokens=True)
    return {"generated_text": generated_text}