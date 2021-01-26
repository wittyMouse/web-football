export interface Order {
  label: string;
  dataIndex: string;
  unit: string;
}

export interface OrderMap {
  [propName: string]: Order;
}
