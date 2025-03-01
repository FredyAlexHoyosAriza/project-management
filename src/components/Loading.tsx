import { RingLoader } from "react-spinners";

const Loading = () => {
  return (
    // Evita que la página se renderice sin datos
    <div className="w-full h-full grid place-items-center box-border">
      <RingLoader color="white" size={100} />
    </div>
  );
};

export default Loading;