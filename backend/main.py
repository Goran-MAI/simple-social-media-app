# backend/main.py
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.routes.endpoints.post_routes import router as post_router
from backend.routes.endpoints.user_routes import router as user_router
from backend.init_db import init_db
from fastapi.staticfiles import StaticFiles
import os, yaml

app = FastAPI(title="Simple Social Media API", version="0.1")

# serve uploads
# create folder for img uploads (locally)
os.makedirs("backend/uploads", exist_ok=True)

# mount folder for uploads/reads
app.mount("/uploads", StaticFiles(directory="backend/uploads"), name="uploads")

# Cross-Origin Resource Sharing (CORS)
# Origin = combination of protocol, domain, and port
# Example:
# http://localhost:5173 → Frontend
# http://localhost:8000 → Backend
# Browsers block requests from a frontend running on a different origin than the backend.
# CORS allows the backend to explicitly permit such cross-origin requests.

# original
# app.add_middleware(
#    CORSMiddleware,
#    allow_origins=["http://localhost:5173"],
#    allow_credentials=True,
#    allow_methods=["*"],
#    allow_headers=["*"],
# )
######
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or ["http://localhost:8080"]
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
# Routes in post_routes/user_routes should be defined without the prefix path,
# since we add it here via the `prefix` parameter.
app.include_router(post_router, prefix="/posts")
app.include_router(user_router, prefix="/users")
