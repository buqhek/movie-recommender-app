import type { ReactNode } from "react";

interface Props {
  children: string;
}

function Search({ children }: Props) {
  return <div>{children}</div>;
}

export default Search;
