import './profileEdit.css';
import { useState, useEffect } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getByEmail, updateUser } from "../../data/repo";
import Button from '@mui/material/Button';

function ProfileEdit(props) {
    const [user, setUser] = useState(null);
    const [fields, setFields] = useState(null);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();
    const { email } = useParams();

    useEffect(() => {
        async function loadUser() {
            try {
                const currentUser = await getByEmail(email);
                setUser(currentUser);
                setFields({
                    username: currentUser.username,
                    first_name: currentUser.first_name,
                    last_name: currentUser.last_name
                });
                setFieldsNullToEmpty(currentUser);
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        }
        loadUser();
    }, [email]);

    const setFieldsNullToEmpty = (currentFields) => {
        currentFields = { ...currentFields };
        for (const [key, value] of Object.entries(currentFields)) {
            currentFields[key] = value !== null ? value : "";
        }
        setFields(currentFields);
    };

    const handleInputChange = (event) => {
        const targetName = event.target.name;
        const targetValue = event.target.value;
        const temp = { ...fields };
        temp[targetName] = targetValue;
        setFields(temp);
    };

    const handleValidation = () => {
        const trimmedFields = trimFieldsEmptyToNull();
        const currentErrors = {};
        const validations = {
            username: { max: 32, errorMsg: "Username length cannot be greater than 32." },
            first_name: { max: 40, errorMsg: "First name length cannot be greater than 40." },
            last_name: { max: 40, errorMsg: "Last name length cannot be greater than 40." }
        };

        for (const [key, validation] of Object.entries(validations)) {
            const field = trimmedFields[key];
            if (field === null) {
                currentErrors[key] = `${key.replace("_", " ")} is required.`;
            } else if (field.length > validation.max) {
                currentErrors[key] = validation.errorMsg;
            }
        }
        setErrors(currentErrors);
        return { trimmedFields, isValid: Object.keys(currentErrors).length === 0 };
    };

    const trimFieldsEmptyToNull = () => {
        const trimmedFields = {};
        for (const [key, value] of Object.entries(fields)) {
            let field = value;
            if (field !== null) {
                field = field.trim();
                if (field.length === 0)
                    field = null;
            }
            trimmedFields[key] = field;
        }
        return trimmedFields;
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const validationResults = handleValidation();
        if (validationResults.isValid) {
            try {
                await updateUser(validationResults.trimmedFields);
                props.edit(validationResults.trimmedFields)
                navigate("/profile");
            } catch (error) {
                console.error("Error updating user:", error);
            }
        }
    };

    if (user === null || fields === null)
        return null;

    return (
        <div>
            <h1>Edit User</h1>
            <hr />
            <div className="mainHeight">
                <div>
                    <form onSubmit={handleSubmit}>
                        <div className="form-group">
                            <label htmlFor="username" className="control-label">Username</label>
                            <input type="text" name="username" id="username" className="form-control"
                                value={fields.username} onChange={handleInputChange} />
                            {errors.username && <div className="text-danger">{errors.username}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="first_name" className="control-label">First Name</label>
                            <input type="text" name="first_name" id="first_name" className="form-control"
                                value={fields.first_name} onChange={handleInputChange} />
                            {errors.first_name && <div className="text-danger">{errors.first_name}</div>}
                        </div>
                        <div className="form-group">
                            <label htmlFor="last_name" className="control-label">Last Name</label>
                            <input type="text" name="last_name" id="last_name" className="form-control"
                                value={fields.last_name} onChange={handleInputChange} />
                            {errors.last_name && <div className="text-danger">{errors.last_name}</div>}
                        </div>
                        <br />
                        <div>
                            <Button className='btn_Save' type="submit">Save</Button>
                            <Button className='btn_Save'>
                                <Link className="nav-link" to="/profile">Cancel</Link>
                            </Button>
                        </div>
                    </form>
                    <br />
                </div>
            </div>
        </div>
    );
}

export default ProfileEdit;
