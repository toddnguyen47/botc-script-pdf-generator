import { NightOrders } from "../types";
import { getImageSrc } from "../utils/nightOrder";
import "./NightOrderPanel.css";

type NightOrderPanelProps = {
  nightOrders: NightOrders;
  iconUrlTemplate?: string;
};

export const NightOrderPanel = (props: NightOrderPanelProps) => {
  const firstNightOrder = props.nightOrders.first;
  const otherNightOrder = props.nightOrders.other;
  return (
    <div className="night-orders-container">
      <div className="night-order">
        <p>First Night:</p>
        <div className="icon-row">
          {firstNightOrder.map((item) => (
            <img
              src={getImageSrc(item, props.iconUrlTemplate)}
              className={typeof item === "string" ? "icon marker-icon" : "icon"}
            ></img>
          ))}
        </div>
      </div>
      <div className="night-order">
        <p>Other Nights:</p>
        <div className="icon-row">
          {otherNightOrder.map((item) => (
            <img
              src={getImageSrc(item, props.iconUrlTemplate)}
              className={typeof item === "string" ? "icon marker-icon" : "icon"}
            ></img>
          ))}
        </div>
      </div>
    </div>
  );
};
