import { Link } from "react-router";
import { Card } from "antd";

interface CategoryCardProps {
  title: string;
  icon: string;
  url?: string;
  searchParams?: string;
  categoryType?: string;
  cardColor: string;
  onClick?: () => void;
  nonClickable?: boolean;
  cardClassNames?: string;
  cardKey: string;
}

const CategoryCard: React.FC<CategoryCardProps> = (props) => {
  return props.nonClickable ? (
    <div>
      <Card
        hoverable
        onClick={props.onClick}
        className={`${props.cardClassNames} content-start w-full mx-auto h-[165px] py-[30px] px-[15px] rounded-[10px] bg-[#ffffff]  shadow-[0px_10px_20px] shadow-[#0a9c020d] mb-4`}
      >
        <div className="flex flex-col h-full items-center">
          <div className="card-icon flex flex-1 w-full items-center justify-center relative mb-[23px] py-0 px-[65px] ">
            <img
              className="max-w-[48px] max-h-[48px]"
              src={props.icon}
              alt="category icon"
            />
          </div>
          <h3 className="m-0 absolute bottom-4 !text-[16px] font-bold text-gray-600 fm-rg">
            {props.title}
          </h3>
        </div>
      </Card>
    </div>
  ) : (
    <>
      {props.cardKey === "doctorsAndCounselingPsychologist" ? (
        <a
          href="https://sso.inhso.ir/oidc/auth?client_id=client_1754117598828_b4e0885381f0f549&redirect_uri=https://consultation.inhso.ir/LoginFromSso&response_type=code&state=random-string&scope=openid%20profile%20email%20offline_access&resource=https://inhso.ir"
          target="_blank"
        >
          <Card
            hoverable
            onClick={props.onClick}
            className={`${props.cardColor} cards-style content-start !mx-auto !mb-4 xs:w-20 md:w-[120px] w-[60px] !p-0 rounded-lg shadow-[0px_10px_20px] shadow-[#0a9c020d]`}
          >
            <div className="flex flex-col h-full items-center">
              <div className="card-icon flex flex-1 w-full items-center justify-center relative py-0">
                <img
                  className="w-12 h-12 xs:w-16 xs:h-16 md:!w-[100px] md:!h-[100px] "
                  src={props.icon}
                  alt="category icon"
                />
              </div>
            </div>
          </Card>
          <h3 className="m-0 bottom-2 text-xs xs:!text-sm text-center font-bold text-gray-600">
            {props.title}
          </h3>
        </a>
      ) : (
        <Link
          to={{ pathname: props.url || "/search", search: props.searchParams }}
          state={{ type: props.categoryType }} // Pass state separately
        >
          <Card
            hoverable
            onClick={props.onClick}
            className={`${props.cardColor} cards-style content-start !mx-auto !mb-4 xs:w-20 md:w-[120px] w-[60px] !p-0 rounded-lg shadow-[0px_10px_20px] shadow-[#0a9c020d]`}
          >
            <div className="flex flex-col h-full items-center">
              <div className="card-icon flex flex-1 w-full items-center justify-center relative py-0">
                <img
                  className="w-12 h-12 xs:w-16 xs:h-16 md:!w-[100px] md:!h-[100px] "
                  src={props.icon}
                  alt="category icon"
                />
              </div>
            </div>
          </Card>
          <h3 className="m-0 bottom-2 text-xs xs:!text-sm text-center font-bold text-gray-600">
            {props.title}
          </h3>
        </Link>
      )}
    </>
  );
};

export default CategoryCard;
