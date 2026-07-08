import { useEffect } from "react";

export default function Home() {
  useEffect(() => {
    const callAPI = async () => {
      try {
        // A página inicial pode ser usada posteriormente para navegação.
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    callAPI();
  }, []);

  return <></>;
}
