export type DialogProps = {
  items: string[];
  onConfirm: () => void;
  onCancel?: () => void;
  title: string;
};

export type UseConfirmDialogReturn = {
  open: (props: DialogProps) => void;
  close: () => void;
};
