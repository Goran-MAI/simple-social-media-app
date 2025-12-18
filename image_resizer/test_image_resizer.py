import os
from PIL import Image
from resizer import create_small_image

def test_resizer():
    assert True

def test_create_small_image(tmp_path):
    # Arrange
    upload_dir = tmp_path
    filename = "test.jpg"
    img_path = upload_dir / filename

    # Create dummy image
    img = Image.new("RGB", (1000, 500))
    img.save(img_path)

    # Act
    create_small_image(filename, upload_dir=str(upload_dir))

    # Assert
    small_img = upload_dir / "test_small.jpg"
    assert small_img.exists()

    with Image.open(small_img) as img:
        assert img.width <= 250
