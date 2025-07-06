import { Button, Card, Form } from 'react-bootstrap';
import { Fragment, KeyboardEvent, useCallback, useRef } from 'react';

import AnonymousPost from '../components/AnonymousPost';
import { useFormik } from 'formik';
import { toPng } from 'html-to-image';

export function Component() {
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
              type="file"
              name="image"
              value={values.image}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Text</Form.Label>
            <Form.Control
              ref={textRef}
              as="textarea"
              name="text"
              rows={6}
              value={values.text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
          <Form.Group>
            <Button variant="success" onClick={handleDownloadClick}>
              Download PNG
            </Button>
          </Form.Group>
        </Form>
      </Card>
      <Card body>
        <AnonymousPost
          filename="test.jpg"
          imgSrc="https://i.imgur.com/x9Nsgo0.png"
          ref={postRef}
          text={values.text}
        />
      </Card>
    </Fragment>
  );
}
