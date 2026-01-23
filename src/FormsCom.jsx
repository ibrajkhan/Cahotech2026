import "./Rsvp.css";
import { Row, Col } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import InputGroup from "react-bootstrap/InputGroup";
import * as yup from "yup";
import Button from "react-bootstrap/Button";
import { useFormik } from "formik";
import { useState, useRef } from "react";
import Spinner from "react-bootstrap/Spinner";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import CahoIcon from "./assets/Img/cahotech-logo.png";

const FormsCom = () => {
  const [loading, setLoading] = useState(false);
  const formRef = useRef(null);
  const MySwal = withReactContent(Swal);

  const schema = yup.object().shape({
    name: yup.string().required("Name Required"),

    email: yup
      .string()
      .required("Email Required")
      .matches(
        /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z]{2,}$/i,
        "Invalid email address",
      ),
    phone: yup
      .string()
      .required("Phone number is required")
      .matches(
        /^(\+?\d{1,4}[\s-]?)?\(?\d{3}\)?[\s-]?\d{3}[\s-]?\d{4}$/,
        "Invalid phone number",
      ),
    // organisation: yup.string().required("Organisation Required"),
    // consent: yup.bool(),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      phone: "",
      // organisation: "",
      // consent: false, // Default should be boolean
    },
    validationSchema: schema,
    // current

    onSubmit: async (values, { resetForm }) => {
      if (loading) return; // prevent double click
      setLoading(true);

      const normalizedPhone = values.phone.replace(/\D/g, "");

      try {
        // 🚀 FAST duplicate check (filtered query)
        const checkUrl = `${import.meta.env.VITE_DATABASE}/search?Phone=${normalizedPhone}`;

        const checkRes = await fetch(checkUrl, { method: "GET" });
        if (!checkRes.ok) throw new Error("Duplicate check failed");

        const existing = await checkRes.json();

        if (existing.length > 0) {
          setLoading(false);
          MySwal.fire({
            icon: "warning",
            title: "Already Registered",
            text: "This phone number is already registered.",
          });
          return;
        }

        // ✅ New registration
        const payload = {
          Name: values.name,
          Email: values.email,
          Phone: normalizedPhone,
          // Organisation: values.organisation,
          "Registration Status": "New Registration Present",
          Kit: "",
        };

        const submitRes = await fetch(import.meta.env.VITE_DATABASE, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({ data: [payload] }),
        });

        if (!submitRes.ok) throw new Error("Submission failed");

        MySwal.fire({
          icon: "success",
          title: "Registration Successful",
          text: "Thank you for registering for CAHO DIAGNOSTICON 2026.",
        });

        resetForm();
      } catch (err) {
        console.error(err);
        MySwal.fire({
          icon: "error",
          title: "Error",
          text: "Please try again later.",
        });
      } finally {
        setLoading(false);
      }
    },
  });

  return (
    <div id="rsvp">
      <div className="rsvp">
        <div className="rsvp__content">
          {/* <h3 className="montaga-regulars header_text">
            Registration CAHOTECH 2026
          </h3> */}
          <h2 className="dataHead_sec text-center">
            Registration Caho Diagnosticon
          </h2>
        </div>
      </div>

      <Form
        name="contact"
        onSubmit={formik.handleSubmit}
        noValidate
        className="form__content"
        ref={formRef}
      >
        <div className="rsvp__content">
          <Row className="mb-3">
            <Form.Group
              as={Col}
              md="6"
              xs="12"
              controlId="validationFormik101"
              className="position-relative text_field "
            >
              <Form.Label className="montaga-regulars label_">Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                className="custom-input"
                value={formik.values.name}
                onChange={formik.handleChange}
                placeholder="First name"
                isInvalid={!!formik.errors.name}
                isValid={formik.touched.name && !formik.errors.name}
              />
              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars"
              >
                {formik.errors.name}
              </Form.Control.Feedback>{" "}
            </Form.Group>

            {/* <Form.Group
              as={Col}
              md="6"
              xs="12"
              controlId="validationCustom02 "
              className="text_field "
            >
              <Form.Label className="montaga-regulars label_">
                Organisation
              </Form.Label>
              <Form.Control
                type="text"
                name="organisation"
                className="custom-input"
                onChange={formik.handleChange}
                value={formik.values.organisation}
                placeholder="Organisation"
                isValid={
                  formik.touched.organisation && !formik.errors.organisation
                }
                isInvalid={!!formik.errors.organisation}
              />
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars"
              >
                {formik.errors.organisation}
              </Form.Control.Feedback>

              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
            </Form.Group> */}

            <Form.Group
              as={Col}
              md="6"
              xs="12"
              controlId="validationCustomUsername"
              className="text_field "
            >
              <Form.Label className="montaga-regulars label_">Email</Form.Label>
              <InputGroup hasValidation>
                <Form.Control
                  type="text"
                  placeholder="Email"
                  className="custom-input"
                  name="email"
                  value={formik.values.email}
                  onChange={formik.handleChange}
                  aria-describedby="inputGroupPrepend"
                  isValid={formik.touched.email && !formik.errors.email}
                  isInvalid={!!formik.errors.email}
                />
                <Form.Control.Feedback
                  type="invalid"
                  className="montaga-regulars"
                >
                  {formik.errors.email}
                </Form.Control.Feedback>
                <Form.Control.Feedback className="montaga-regulars">
                  Looks Good!
                </Form.Control.Feedback>
              </InputGroup>
            </Form.Group>

            <Form.Group
              as={Col}
              md="6"
              xs="12"
              controlId="validationCustom02 "
              className="text_field "
            >
              <Form.Label className="montaga-regulars label_">Phone</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                className="custom-input"
                onChange={formik.handleChange}
                value={formik.values.phone}
                placeholder="Phone"
                isValid={formik.touched.phone && !formik.errors.phone}
                isInvalid={!!formik.errors.phone}
              />
              <Form.Control.Feedback
                type="invalid"
                className="montaga-regulars"
              >
                {formik.errors.phone}
              </Form.Control.Feedback>

              <Form.Control.Feedback className="montaga-regulars">
                Looks Good!
              </Form.Control.Feedback>
            </Form.Group>

            {/* <Form.Group
              as={Col}
              md="6"
              xs="12"
              controlId="validationCustom02"
              className="text_field"
            >
              <Form.Label className="montaga-regulars label_">Phone</Form.Label>
              <PhoneInput
                country={"in"} // Default country code
                value={formik.values.phone}
                className="custom-input ins"
                onChange={(phone) => formik.setFieldValue("phone", phone)}
                inputProps={{
                  name: "phone",
                  // className: "phonew",

                  // className: `custom-input ${
                  //   formik.touched.phone && formik.errors.phone
                  //     ? "is-invalid"
                  //     : ""
                  // }`,
                  placeholder: "Phone Number",
                }}
              />
              {formik.errors.phone && formik.touched.phone && (
                <Form.Control.Feedback
                  type="invalid"
                  className="montaga-regulars d-block"
                >
                  {formik.errors.phone}
                </Form.Control.Feedback>
              )}
              {!formik.errors.phone && formik.touched.phone && (
                <Form.Control.Feedback className="montaga-regulars">
                  Looks Good!
                </Form.Control.Feedback>
              )}
            </Form.Group> */}

            {/* <Form.Group className="mb-3" controlId="formBasicCheckbox">
              <Form.Check
                type="checkbox"
                name="consent"
                label="By ticking this box, you consent to share your personal details filled in this form with the exhibitors of this conference."
                checked={formik.values.consent} // Use 'checked' instead of 'value'
                onChange={formik.handleChange}
              />
            </Form.Group> */}
          </Row>

          <Button
            type="submit"
            disabled={loading}
            className="button-sub montaga-regulars mt-1"
          >
            {loading && (
              <Spinner
                as="span"
                animation="grow"
                size="sm"
                role="status"
                aria-hidden="true"
              />
            )}
            {loading ? "Processing..." : "Submit"}
          </Button>
        </div>
      </Form>
    </div>
  );
};

export default FormsCom;
