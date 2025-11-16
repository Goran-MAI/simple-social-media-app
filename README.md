# SSMA

SSMA is a Python project that demonstrates a simple full-stack setup with **SQLModel**, **PostgreSQL**, and a structured backend and frontend. The project supports adding users and posts, and includes automated tests for database functionality.

---

## Project Structure

```text
SSMA/
    .github/
        workflows/
    backend/
        add_post.py
        init_db.py
        models/
            post.py
            user.py
            __init__.py
        routes/
            crud/
                post_crud.py
                user_crud.py
                __init__.py
            doc/
                openapi_post_spec.yaml
                openapi_user_spec.yaml
            endpoints/
                post_routes.py
                user_routes.py
                __init__.py
            __init__.py
        __init__.py
    frontend/
        __init__.py
    pathlib_output.py
    tests/
        test_db.py
        __init__.py
```

---

## Installation

1. Clone the repository:

```bash
git clone https://github.com/Goran-MAI/simple-social-media-app
cd SSMA
```

2. Create a virtual environment

```bash
python -m venv .venv
# Windows
.venv\Scripts\activate
# macOS/Linux
source .venv/bin/activate
```

3. Install dependencies
```bash
pip install -r requirements.txt
```

4. Database Setup
```bash
python -m backend.init_db
```

5. To add sample posts:
```bash
python -m backend.add_post
```

6. Running Tests
```bash
pytest -v
```
Tests include:
* Creating a user
* Adding posts
* Selecting the latest post by post_date

7. Starting backend (endpoints)
* Main (including User and Posts)
```bash
python -m uvicorn backend.main:app --reload
```

