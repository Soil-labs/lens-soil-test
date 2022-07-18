interface ErrorProps {
  message?: string;
}

export const Error = ({ message = "Error" }: ErrorProps) => {
  return (
    <div className="flex justify-center items-center">
      <div className="text-red-500">{message}</div>
    </div>
  );
};
