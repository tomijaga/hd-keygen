import { ReactNode, useState } from "react";

import EyeFilled from "@ant-design/icons/EyeFilled";
import EyeInvisibleFilled from "@ant-design/icons/EyeInvisibleFilled";

import Button from "antd/lib/button";
import Space from "antd/lib/space";
import Typography from "antd/lib/typography";

interface Props {
  title: string;
  openIcon?: ReactNode;
  closeIcon?: ReactNode;
  onClick?: () => any;
  onAction?: (isOpen: boolean) => any;
  isInitiallyOpen?: boolean;
}

export const ColumnTitle = ({
  title,
  isInitiallyOpen,
  openIcon,
  closeIcon,
  onClick,
  onAction
}: Props) => {
  const [isOpen, setIsOpen] = useState(isInitiallyOpen ?? true);
  openIcon = openIcon || <EyeFilled />;
  closeIcon = closeIcon || <EyeInvisibleFilled />;

  const [icon, setIcon] = useState<ReactNode>(
    (() => {
      if (isInitiallyOpen === undefined) return openIcon;

      if (isInitiallyOpen) {
        return openIcon;
      } else {
        return closeIcon;
      }
    })()
  );

  const toggleIcon = () => {
    if (isOpen) {
      setIcon(closeIcon);
    } else {
      setIcon(openIcon);
    }
    onClick?.();
    onAction?.(!isOpen);
    setIsOpen((prev: boolean) => !prev);
  };
  return (
    <Space direction="horizontal">
      <Typography.Text>{title}</Typography.Text>
      <Button onClick={toggleIcon} type="text" shape="circle" icon={icon} />
    </Space>
  );
};
