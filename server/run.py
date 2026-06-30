import uvicorn
import os

if __name__ == "__main__":
    # Ensure working directory is the server directory
    os.chdir(os.path.dirname(os.path.abspath(__file__)))
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
