# Dockerfile
FROM python:3.7.12

# directorio dentro del contenedor para el código
WORKDIR /app 
COPY . /app
RUN pip install -r requirements.txt
        
ENV FLASK_APP app.py
ENV FLASK_RUN_HOST 0.0.0.0
ENV FLASK_ENV development 
      
        
CMD ["gunicorn", "-w", "4", "--bind", " 0.0.0.0:5000" , "wsgi:app"]