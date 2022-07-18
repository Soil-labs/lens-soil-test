interface LoadingProps {
  message?: string;
}

export const Loading = ({ message = "Loading..." }: LoadingProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className="spinner"></div>
      {message && <div>{message}</div>}
    </div>
  );
};
