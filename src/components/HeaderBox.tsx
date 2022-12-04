interface HeaderBoxProps {
  title: string;
}

const HeaderBox: React.FC<HeaderBoxProps> = ({ title }) => {
  return (
    <div className="header-box">
      <div className="header-box-title">{title}:</div>
      <div className="devider" />
    </div>
  );
};

export default HeaderBox;
