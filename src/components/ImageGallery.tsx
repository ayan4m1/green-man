import chunk from 'lodash.chunk';
import { Col, Container, Row } from 'react-bootstrap';

type ImageGalleryItem = {
  data: string;
  filename: string;
};

interface ImageGalleryProps {
  images: ImageGalleryItem[];
  onImageSelect: (image: string, filename: string) => void;
}

export default function ImageGallery({
  images,
  onImageSelect
}: ImageGalleryProps) {
  const rows = chunk(images, 4);

  return (
    <Container className="my-4">
      {rows.map((row, idx) => (
        <Row key={idx}>
          {row.map((image, idx) => (
            <Col
              className="d-flex justify-content-center"
              key={idx}
              sm={3}
              xs={12}
            >
              <img
                className="border border-4 border-primary rounded"
                height={96}
                onClick={() => onImageSelect(image.data, image.filename)}
                src={image.data}
                style={{ cursor: 'pointer' }}
              />
            </Col>
          ))}
        </Row>
      ))}
    </Container>
  );
}
