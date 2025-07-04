interface AnonymousPostProps {
  text: string;
}

export default function AnonymousPost({ text }: AnonymousPostProps) {
  return (
    <div className="anonymous-post">
      <div className="row">
        <div className="col">
          <input type="checkbox" /> <span className="author">Anonymous</span>{' '}
          07/04/25(Fri)11:29:15 No.2138491
        </div>
      </div>
      <div className="row">
        <div className="col">
          File: <span className="link">ballsack.jpg</span> (120 KB, 512x512)
        </div>
      </div>
      <img src="https://ps.w.org/sb-rss-feed-plus/assets/icon-256x256.png?rev=1101553" />
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
  );
}
