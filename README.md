# SSMA

SSMA is a Python project that demonstrates a simple full-stack setup with **SQLModel**, **PostgreSQL**, and a structured backend and frontend. The project supports adding users and posts, and includes automated tests for database functionality.

---

## Project Structure

```text
SSMA/
    .git/
        hooks/
        info/
        logs/
        objects/
        refs/
    .github/
        workflows/
    .idea/
        inspectionProfiles/
    .pytest_cache/
        v/
    .venv/
        include/
        Lib/
        Scripts/
            activate_this.py
    backend/
        add_post.py
        init_db.py
        models/
            post.py
            user.py
            __init__.py
        routes/
            __init__.py
        __init__.py
    frontend/
        src/
        __init__.py
    main.py
    pathlib_output.py
    tests/
        .pytest_cache/
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
