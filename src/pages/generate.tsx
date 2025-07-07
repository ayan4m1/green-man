import { Button, Card, Form } from 'react-bootstrap';
import {
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useCallback,
  useRef,
  useState
} from 'react';

import AnonymousPost from '../components/AnonymousPost';
import { useFormik } from 'formik';
import { toPng } from 'html-to-image';
import { filesize } from 'filesize';

export function Component() {
  const [imageSize, setImageSize] = useState<string>(
    filesize(128000, { standard: 'jedec' })
  );
  const [dims, setDims] = useState<string>('512x512');
  const [filename, setFilename] = useState<string>('empty.jpg');
  const [image, setImage] = useState<string>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const postRef = useRef<HTMLDivElement>(null);
  const { handleChange, handleSubmit, values, setFieldValue } = useFormik({
    initialValues: {
      image: null,
      text: `> be anon
> write greentext

screenshot it`
    },
    onSubmit: () => {}
  });
  const handleDownloadClick = useCallback(async () => {
    if (!postRef.current) {
      return;
    }

    try {
      const dataUrl = await toPng(postRef.current);
      const link = document.createElement('a');

      link.download = 'greentext.png';
      link.href = dataUrl;

      link.click();
    } catch (error) {
      console.error(error);
    }
  }, []);
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        const lines = textRef.current.value.split('\n');

        if (!lines?.length) {
          return;
        }

        // const cursorPos = textRef.current.selectionStart;
        // todo: figure out if the line we are on starts with a >
        // !lines[lines.length - 1].startsWith('>')

        setFieldValue(
          'text',
          `${textRef.current.value}
> `
        );
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [setFieldValue]
  );
  const handleFileChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      const { files } = event.target;
      const [file] = files;

      if (!file) {
        return;
      }

      const reader = new FileReader();
      const image = new Image();

      reader.addEventListener('load', () => {
        const dataUrl = reader.result as string;

        setImageSize(filesize(file.size, { standard: 'jedec' }));
        setFilename(file.name);
        setImage(dataUrl);
        image.src = dataUrl;
      });
      image.addEventListener('load', () =>
        setDims(`${image.width}x${image.height}`)
      );

      reader.readAsDataURL(file);
    },
    []
  );

  return (
    <Fragment>
      <title>Generate 4Chan Reply</title>
      <Card body>
        <Card.Title className="mb-4 text-light">
          Generate 4Chan Reply
        </Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Image</Form.Label>
            <Form.Control
              name="image"
              onChange={handleFileChange}
              type="file"
              value={values.image}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              name="text"
              onChange={handleChange}
              onKeyDown={handleKeyDown}
              ref={textRef}
              rows={6}
              value={values.text}
            />
          </Form.Group>
          <Form.Group>
            <Button onClick={handleDownloadClick} variant="success">
              Download PNG
            </Button>
          </Form.Group>
        </Form>
      </Card>
      <Card body>
        <AnonymousPost
          dimensions={dims}
          filename={filename}
          image={image}
          ref={postRef}
          size={imageSize}
          text={values.text}
        />
      </Card>
    </Fragment>
  );
}
