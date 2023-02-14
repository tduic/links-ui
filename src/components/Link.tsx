import React from "react";

import Button from "react-bootstrap/Button";

interface LinkProps {
  id: number;
  value: number;
}

const Link: React.FC<LinkProps> = (props: LinkProps) => (
  <div className="p-1">
    <Button variant="dark" className="mr-1">
      {props.value}
    </Button>
  </div>
);

export default Link;
