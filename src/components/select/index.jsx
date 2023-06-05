import React from 'react';
import { Select } from 'antd';
import { SearchOutlined } from '@ant-design/icons';


const { Option } = Select;
export const SelectDropdown = ({isOpen}) =>{
    console.log(isOpen, "isOpen")
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
        style={{ width: 200 }}
        placeholder="Select an option"
        optionFilterProp="children"
        
        suffixIcon={<SearchOutlined />}
        onSearch={handleSearch}
        onSelect={handleSelect}
        filterOption={(input, option) =>
          option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
        autoFocus={true}
        isOpen={true}
      >
        <Option value="option1">Option 1</Option>
        <Option value="option2">Option 2</Option>
        <Option value="option3">Option 3</Option>
        <Option value="option4">Option 4</Option>
        <Option value="option4">Option 4</Option>
        <Option value="option4">Option 4</Option>
        <Option value="option4">Option 4</Option>
        <Option value="option4">Option 4</Option>
        <Option value="option4">Option 4</Option>
      </Select>
    )

}