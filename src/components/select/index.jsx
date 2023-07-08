import React from 'react';
import { Select, Menu } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


const { Option } = Select;
export const SelectDropdown = ({isOpen}) =>{
    const handleSearch = (value) => {
        console.log('Search:', value);
        // Add your custom search logic here
      };
    
      const handleSelect = (value) => {
        console.log('Selected:', value);
        // Handle the selected value here
      };

    return(
        <Select
        showSearch
        style={{ width: 200, }}
        placeholder="Select an option"
        optionFilterProp="children"
        dropdownStyle={{ width:'200px', height:'140px' , maxHeight:'140px', overflowY:'auto'}}
        suffixIcon={<SearchOutlined />}
        onSearch={handleSearch}
        onSelect={handleSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        autoFocus
      >
        <Menu.Item value="option1">Option 1</Menu.Item>
        <Menu.Item value="option2">Option 2</Menu.Item>
        <Menu.Item value="option3">Option 3</Menu.Item>
        <Menu.Item value="option4">Option 4</Menu.Item>
        <Menu.Item value="option5">Option 5</Menu.Item>
        <Menu.Item value="option6">Option 6</Menu.Item>
        <Menu.Item value="option7">Option 7</Menu.Item>
        {/* <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option3">Option 3</Option>
        <Option value="option4">Option 4</Option>
        <Option value="option5">Option 5</Option>
        <Option value="option5">Option 6</Option>
        <Option value="option5">Option 7</Option>
        <Option value="option5">Option 8</Option> */}
      </Select>
    )

}