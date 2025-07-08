import { format } from 'date-fns';
import { forwardRef, Ref, useMemo } from 'react';

const generatePostNumber = () => 2e6 + Math.floor(Math.random() * 1.5e6);

const getPostTimestamp = () => format(Date.now(), 'MM/dd/yy (EEE) HH:mm:ss');

interface AnonymousPostProps {
  dimensions?: string;
  filename?: string;
  image?: string;
  size?: string;
  text: string;
}

const AnonymousPost = (
  { dimensions, filename, image, size, text }: AnonymousPostProps,
  ref: Ref<HTMLDivElement>
) => {
  const postNumber = useMemo(() => generatePostNumber(), []);
  const timestamp = useMemo(() => getPostTimestamp(), []);

  return (
    <div className="anonymous-post" ref={ref}>
      <div className="row">
        <div className="col">
          <div className="checkbox" /> <span className="author">Anonymous</span>{' '}
          {timestamp} No.{postNumber}
        </div>
      </div>
      {Boolean(filename) && (
        <div className="row">
          <div className="col">
            File: <span className="link">{filename}</span> ({size}, {dimensions}
            )
          </div>
        </div>
      )}
      <div className="d-flex">
        {Boolean(image) && (
          <div className="flex-shrink-1">
            <img src={image} />
          </div>
        )}
        <div className="w-100">
          {text
            .split('\n')
            .map((text, idx) =>
              text.startsWith('>') ? (
                <pre key={idx}>{text}</pre>
              ) : (
                <span key={idx}>{text}</span>
              )
            )}
        </div>
      </div>
    </div>
  );
};

export default forwardRef(AnonymousPost);
