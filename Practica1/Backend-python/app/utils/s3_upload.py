import boto3
import time
from botocore.exceptions import NoCredentialsError
from app.config import Config
import os

s3 = boto3.client(
    "s3",
    region_name=Config.AWS_REGION,
    aws_access_key_id=Config.AWS_ACCESS_KEY_ID,
    aws_secret_access_key=Config.AWS_SECRET_ACCESS_KEY
)

def upload_profile_image(file):
    try:
        # Generar nombre único
        original_name = file.filename.replace(" ", "_")
        filename = f"{int(time.time())}_{original_name}"
        key = f"Fotos_Perfil/{filename}"

        # IMPORTANTE: resetear puntero del archivo
        file.seek(0)

        s3.upload_fileobj(
            file,
            Config.AWS_BUCKET_NAME,
            key,
            ExtraArgs={
                "ContentType": file.content_type
            }
        )

        return key

    except NoCredentialsError:
        raise Exception("Credenciales AWS inválidas")

    except Exception as e:
        raise Exception(f"Error subiendo imagen a S3: {str(e)}")