import { Card, Form } from 'react-bootstrap';
import { Fragment, KeyboardEvent, useCallback } from 'react';

import AnonymousPost from '../components/AnonymousPost';
import { useFormik } from 'formik';

export function Component() {
  const { handleChange, handleSubmit, values, setFieldValue } = useFormik({
    initialValues: {
      text: `> be anon
> write greentext

screenshot it`
    },
    onSubmit: () => {}
  });
  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter') {
        const lines = values.text.split('\n');

        if (!lines?.length || !lines[lines.length - 1].startsWith('>')) {
          return;
        }

        setFieldValue(
          'text',
          `${values.text}
> `
        );
        e.stopPropagation();
        e.preventDefault();
      }
    },
    [values.text, setFieldValue]
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
            <Form.Label>Text</Form.Label>
            <Form.Control
              as="textarea"
              name="text"
              rows={6}
              value={values.text}
              onChange={handleChange}
              onKeyDown={handleKeyDown}
            />
          </Form.Group>
        </Form>
      </Card>
      <Card body>
        <AnonymousPost text={values.text} />
      </Card>
    </Fragment>
  );
}
