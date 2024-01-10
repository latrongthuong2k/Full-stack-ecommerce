export const links = [
  {
    name: "header",
    hash: "#header",
  },
  {
    name: "content",
    hash: "#content",
  },
  {
    name: "outContent",
    hash: "#outContent",
  },
] as const;

export const selectedAnimationProps = {
  initial: { scale: 0.5, opacity: 0 },
  animate: { scale: 1, opacity: 1 },
  exit: { scale: 1, opacity: 0 },
  transition: { duration: 0.3 },
};

export const unselectedAnimationProps = {
  initial: { scale: 1, opacity: 1 },
  animate: { scale: 0.8, opacity: 0 },
  exit: { scale: 1, opacity: 1 },
  transition: { duration: 0.3 },
};

export const selectItem = () =>
  [
    {
      id: 1,
      label: "新作順",
      key: "created_at",
      direction: "desc",
    },
    {
      id: 2,
      label: "価格：安い順",
      key: "unit_price",
      direction: "asc",
    },
    {
      id: 3,
      label: "価格：高い順",
      key: "unit_price",
      direction: "desc",
    },
  ] as const;
