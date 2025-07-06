import { format } from 'date-fns';
import { forwardRef, Ref, useMemo } from 'react';

const generatePostNumber = () => 1e6 + Math.floor(Math.random() * 2e6);

const getPostTimestamp = () => format(Date.now(), 'MM/dd/yy (EEE) HH:mm:ss');

interface AnonymousPostProps {
  text: string;
  filename: string;
  imgSrc: string;
}

const AnonymousPost = (
  { filename, text, imgSrc }: AnonymousPostProps,
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
      <div className="row">
        <div className="col">
          File: <span className="link">{filename}</span> (120 KB, 512x512)
        </div>
      </div>
      <div className="d-flex">
        <div className="flex-shrink-1">
          <img src={imgSrc} />
        </div>
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
