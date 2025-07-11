import { Button, Card, Form, InputGroup } from 'react-bootstrap';
import {
  ChangeEvent,
  Fragment,
  KeyboardEvent,
  useCallback,
  useEffect,
  useRef,
  useState
} from 'react';

import AnonymousPost from '../components/AnonymousPost';
import { useFormik } from 'formik';
import { toPng } from 'html-to-image';
import { filesize } from 'filesize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowLeftRotate,
  faDownload
} from '@fortawesome/free-solid-svg-icons';

import pepe from '../images/pepe.png';
import pedobear from '../images/pedobear.png';
import trollface from '../images/trollface.png';
import galaxyBrain from '../images/galaxy-brain.png';
import ImageGallery from '../components/ImageGallery';

export function Component() {
  const postRef = useRef<HTMLDivElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const [imageSize, setImageSize] = useState<string>(null);
  const [dims, setDims] = useState<string>(null);
  const [filename, setFilename] = useState<string>(null);
  const [image, setImage] = useState<string>(null);
  const {
    handleChange,
    handleSubmit,
    errors,
    values,
    setFieldValue,
    setFieldError
  } = useFormik({
    initialValues: {
      image: null,
      text: `> be anon
> write greentext

screenshot it`
    },
    onSubmit: () => {}
  });
  const handleResetClick = useCallback((image: string, filename: string) => {
    const changeEvent = new Event('change');
    const data = atob(image.split(',')[1]);
    const array = new Uint8Array(data.length);
    let i = data.length;

    while (i--) {
      array[i] = data.charCodeAt(i);
    }

    const file = new File([array], filename);
    const dataTransfer = new DataTransfer();

    dataTransfer.items.add(file);

    fileRef.current.files = dataTransfer.files;
    fileRef.current.dispatchEvent(changeEvent);
  }, []);
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

        // todo: figure out if the line we are on starts with a >
        // const cursorPos = textRef.current.selectionStart;
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
      image.addEventListener('load', () => {
        setDims(`${image.width}x${image.height}`);
        setFieldError('image', undefined);
      });
      image.addEventListener('error', () => {
        handleResetClick(trollface, 'trollface.png');
        setFieldError('image', 'Invalid file selected, must be an image!');
      });

      reader.readAsDataURL(file);
    },
    [handleResetClick, setFieldError]
  );

  // needed to bypass React SyntheticEvent for onChange
  useEffect(() => {
    fileRef.current.onchange = (e) =>
      handleFileChange(e as unknown as ChangeEvent<HTMLInputElement>);
  }, [handleFileChange]);

  useEffect(() => {
    handleResetClick(trollface, 'trollface.png');
  }, []);

  return (
    <Fragment>
      <title>Generate 4Chan Comment</title>
      <Card body>
        <Card.Title className="mb-4 text-light">
          Generate a 4Chan Comment
        </Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Choose a local image or use a preset</Form.Label>
            <InputGroup>
              <Form.Control
                isInvalid={Boolean(errors.image)}
                name="image"
                onChange={handleFileChange}
                ref={fileRef}
                type="file"
              />
              <Form.Control.Feedback type="invalid">
                {errors.image as string}
              </Form.Control.Feedback>
              {!errors.image && (
                <InputGroup.Text className="p-0">
                  <Button
                    onClick={() => handleResetClick(trollface, 'trollface.png')}
                    variant="danger"
                  >
                    <FontAwesomeIcon fixedWidth icon={faArrowLeftRotate} />{' '}
                    Reset
                  </Button>
                </InputGroup.Text>
              )}
            </InputGroup>
          </Form.Group>
          <Form.Group>
            <ImageGallery
              images={[
                {
                  data: trollface,
                  filename: 'trollface.png'
                },
                {
                  data: pepe,
                  filename: 'pepe.png'
                },
                {
                  data: pedobear,
                  filename: 'pedobear.png'
                },
                {
                  data: galaxyBrain,
                  filename: 'galaxy-brain.png'
                }
              ]}
              onImageSelect={handleResetClick}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Enter text</Form.Label>
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
            <Button
              className="mt-2"
              onClick={handleDownloadClick}
              variant="success"
            >
              <FontAwesomeIcon fixedWidth icon={faDownload} /> Download PNG
            </Button>
          </Form.Group>
        </Form>
      </Card>
      <Card body>
        <Card.Title className="mb-4 text-light">Your Comment</Card.Title>
        <div className="ms-4">
          <AnonymousPost
            dimensions={dims}
            filename={filename}
            image={image}
            ref={postRef}
            size={imageSize}
            text={values.text}
          />
        </div>
      </Card>
    </Fragment>
  );
}
