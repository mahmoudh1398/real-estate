import HeaderBox from "./HeaderBox";

interface PropertyTypeProps {
  propertyType: string;
  setPropertyType: any;
}

const PropertyType: React.FC<PropertyTypeProps> = ({
  propertyType,
  setPropertyType,
}) => {
  const properties = ["آپارتمانی", "خانه و ویلا", "تجاری"];
  return (
    <div className="property-type">
      <HeaderBox title="نوع ملک" />
      <div className="radio-input-container">
        <div className="radio-input">
          {properties.map((item, index) => (
            <div key={index}>
              <input
                type="radio"
                id={item}
                name="radio"
                value={item}
                onChange={() => setPropertyType(item)}
                checked={item === propertyType}
                className="input"
              />
              <label htmlFor={item} className="input-label">
                {item}
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PropertyType;
