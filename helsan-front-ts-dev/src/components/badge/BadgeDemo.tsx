import { LuShoppingCart } from "react-icons/lu";
import Badge from ".";

const BadgeDemo = () => {
  return (
    <>
      <button className="">
        <Badge content="0" badgeClassName="!text-lg">
          <LuShoppingCart className="w-6 h-6" />
        </Badge>
      </button>
    </>
  );
};

export default BadgeDemo;
