import Vue from 'vue';
// 导入自己需要的组件
import {
  Pagination,
  Dialog,
  Dropdown,
  DropdownMenu,
  DropdownItem,
  Menu,
  Submenu,
  MenuItem,
  MenuItemGroup,
  Input,
  InputNumber,
  Checkbox,
  CheckboxButton,
  CheckboxGroup,
  Switch,
  Select,
  Option,
  OptionGroup,
  Button,
  ButtonGroup,
  Table,
  TableColumn,
  DatePicker,
  TimeSelect,
  TimePicker,
  Popover,
  Tooltip,
  Form,
  FormItem,
  Tabs,
  TabPane,
  Alert,
  Icon,
  Row,
  Col,
  Upload,
  Spinner,
  Card,
  ColorPicker,
  Image,
  Calendar,
  CascaderPanel,
  Loading,
  MessageBox,
  Message,
  Avatar
} from 'element-ui';

Vue.prototype.$loading = Loading.service;
Vue.prototype.$confirm = MessageBox.confirm;
Vue.prototype.$message = Message;

const element = {
  install: function (Vue) {
    Vue.use(Pagination);
    Vue.use(Dialog);
    Vue.use(Dropdown);
    Vue.use(DropdownMenu);
    Vue.use(DropdownItem);
    Vue.use(Menu);
    Vue.use(Submenu);
    Vue.use(MenuItem);
    Vue.use(MenuItemGroup);
    Vue.use(Input);
    Vue.use(InputNumber);
    Vue.use(Checkbox);
    Vue.use(CheckboxButton);
    Vue.use(CheckboxGroup);
    Vue.use(Switch);
    Vue.use(Select);
    Vue.use(Option);
    Vue.use(OptionGroup);
    Vue.use(Button);
    Vue.use(ButtonGroup);
    Vue.use(Table);
    Vue.use(TableColumn);
    Vue.use(DatePicker);
    Vue.use(TimeSelect);
    Vue.use(TimePicker);
    Vue.use(Popover);
    Vue.use(Tooltip);
    Vue.use(Form);
    Vue.use(FormItem);
    Vue.use(Tabs);
    Vue.use(TabPane);
    Vue.use(Alert);
    Vue.use(Icon);
    Vue.use(Row);
    Vue.use(Col);
    Vue.use(Upload);
    Vue.use(Spinner);
    Vue.use(Card);
    Vue.use(ColorPicker);
    Vue.use(Image);
    Vue.use(Calendar);
    Vue.use(CascaderPanel);
    Vue.use(Loading.directive);
    Vue.use(Avatar)
  }
}
export default element
