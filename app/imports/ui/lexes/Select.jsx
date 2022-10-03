import React from "react";
import Select from 'react-select'

export class MySelect extends React.Component {
    handleChange = (value) => {
        // this is going to call setFieldValue and manually update values
        this.props.onChange(this.props.name, value);
    };

    handleBlur = () => {
        // this is going to call setFieldTouched and manually update touched
        this.props.onBlur(this.props.name, true);
    };

    render() {
        let content;
        content = (
            <div style={{ margin: "0 0" }}>
                <Select
                    isMulti
                    onChange={this.handleChange}
                    onBlur={this.handleBlur}
                    value={this.props.value}
                    options={this.props.options}
                    getOptionLabel={(option) => option.nameFr + " / " + option.nameEn}
                    getOptionValue={(option) => option._id}
                    placeholder={this.props.placeholder}
                />
                {!!this.props.error && this.props.touched && (
                    <div style={{ color: "red", marginTop: ".5rem" }}>
                        {this.props.error}
                    </div>
                )}
            </div>
        );
        return content;
    }
}
