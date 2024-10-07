import classNames from 'classnames';

export const getHighlightedText = (text: string, query: string, options?: { className?: string }) => {
  const re = new RegExp(`(${query})`, 'gi');
  if (query !== '' && text.match(re)) {
    const parts = text.split(re);
    return (
      <>
        {parts.map((part) =>
          part.toLowerCase() === query.toLowerCase() ? (
            <span key={Math.random().toString(36).slice(2)} className={classNames(options?.className)}>
              {part}
            </span>
          ) : (
            part
          ),
        )}
      </>
    );
  }
  return text;
};
