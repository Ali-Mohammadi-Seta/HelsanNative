import ListLoadMore from "./listLoadMore";



interface OverFlowProps {
  data: string[]; // or change this type based on actual usage
}

const OverFlow: React.FC<OverFlowProps> = () => {
  // const [isHolidayDay, setHolidayDay] = useState<string[]>([
  //     'ss',
  //     'aa',
  //     'dd',
  //     'ww',
  //     'ff',
  //     'bb',
  // ]);

  return (
    <div>
      <div className="bg-white h-[170px] overflow-auto rounded-b-2xl ps-[10px] shadow-[0_0px_10px_rgb(217,227,240)]">
        <ListLoadMore />
      </div>
    </div>
  );
};

export default OverFlow;
