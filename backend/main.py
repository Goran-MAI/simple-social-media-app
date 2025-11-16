# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.endpoints.post_routes import router as post_router
from backend.routes.endpoints.user_routes import router as user_router
from backend.init_db import init_db
import os, yaml

app = FastAPI(title="Simple Social Media API", version="0.1")

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup-Event
@app.on_event("startup")
def startup_event():
    init_db()
    folder_path = "./backend/routes/doc/"
    os.makedirs(folder_path, exist_ok=True)

    # Post OpenAPI export
    yaml_file_path_post = os.path.join(folder_path, "openapi_post_spec.yaml")
    with open(yaml_file_path_post, "w") as file:
        yaml.dump(app.openapi(), file, default_flow_style=False)

    # User OpenAPI export
    yaml_file_path_user = os.path.join(folder_path, "openapi_user_spec.yaml")
    with open(yaml_file_path_user, "w") as file:
        yaml.dump(app.openapi(), file, default_flow_style=False)

# Including routers
app.include_router(post_router, prefix="/posts")
app.include_router(user_router, prefix="/users")
