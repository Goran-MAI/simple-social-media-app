import os
import yaml
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes.endpoints.user_routes import user_router
from .routes.endpoints.post_routes import post_router
from .init_db import init_db

app = FastAPI(
    title="Simple Social Media API",
    description="This is an API for a small project called 'Simple Social Media', which is being developed as part of the 'Software Engineering' course.",
    version="0.1",)

origins = [
    "http://localhost:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.on_event("startup")
def on_startup():
    init_db()

    openapi_schema = app.openapi()  # export open api-spec as python-dict
    folder_path = "./backend/routes/doc/"
    os.makedirs(folder_path, exist_ok=True)
    yaml_file_path = os.path.join(folder_path, "openapi_post_spec.yaml")

    with open(yaml_file_path, "w") as file:
        yaml.dump(openapi_schema, file, default_flow_style=False)  # save api spec as YAML
    print("OpenAPI-spec for POST written to {} successfully".format(yaml_file_path))

app.include_router(user_router)
app.include_router(post_router)