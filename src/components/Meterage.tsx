import HeaderBox from "./HeaderBox";
import NumberInput from "./NumberInput";

interface MeterageProps {
  metrage: Array<number>;
  setMetrage: React.Dispatch<React.SetStateAction<Array<number>>>;
}
const Meterage: React.FC<MeterageProps> = ({ metrage, setMetrage }) => {
  return (
    <div className="meterage">
      <HeaderBox title="متراژ ملک" />
      <div className="meterage-container">
        <div className="meterage-inputs">
          <NumberInput
            value={metrage[0]}
            onChange={(e) => setMetrage((prev) => [+e.target.value, prev[1]])}
          />
          <div className="meterage-text">{"الی"}</div>
          <NumberInput
            value={metrage[1]}
            onChange={(e) => setMetrage((prev) => [prev[0], +e.target.value])}
          />
        </div>
      </div>
    </div>
  );
};

export default Meterage;
