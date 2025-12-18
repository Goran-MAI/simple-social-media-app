# SSMA

SSMA is a Python project that demonstrates a simple full-stack setup with **SQLModel**, **PostgreSQL**, and a structured backend and frontend. The project supports adding users and posts, and includes automated tests for database functionality.

---

## Project Structure

```text
SSMA/
    -p/
    .github/
        workflows/
            ghcr-build.yml
            ubuntu-python-tests.yml
    backend/
        __init__.py
        add_post.py
        Dockerfile
        init_db.py
        main.py
        models/
            __init__.py
            post.py
            user.py
        routes/
            __init__.py
            crud/
                __init__.py
                posts_crud.py
                user_crud.py
            doc/
                openapi_post_spec.yaml
                openapi_user_spec.yaml
            endpoints/
                __init__.py
                post_routes.py
                user_routes.py
        test_post.py
        test_user.py
        uploads/
            ...
        utils/
            rabbitmq_utils.py
    docker-compose.yaml
    frontend/
        __init__.py
        app/
            .vite/
                deps/
        dist/
            assets/
                index-Bnyca6Ux.css
                index-DgX_r6x0.js
                SSMA_Logo-C3ZM6aVU.svg
            vite.svg
        Dockerfile
        eslint.config.js
        public/
            vite.svg
        src/
            api/
                post.js
                user.js
            App.css
            App.jsx
            assets/
                react.svg
                SSMA_Logo.svg
            components/
                PostForm.jsx
                PostList.jsx
                UserForm.jsx
                UserList.jsx
            index.css
            main.jsx
        vite.config.js
    image_resizer/
        Dockerfile
        resizer.py
        test_image_resizer.py
    pathlib_output.py
    ssh_keys/
    tests/
        __init__.py
        test_db.py
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



8. Execute the following commando in the frontent folder:
```text
...\SSMA\frontend> npm run dev
```

9. As the SSMA web app is now containerized, it can be accessed through: 
```text
Frontend: http://localhost:8080/
Backend API: http://localhost:8000/
```

Info: 
The project uses Python 3.11 consistently across CI, backend and worker containers.

