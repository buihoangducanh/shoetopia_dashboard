import {
  Button,
  FormControl,
  FormErrorMessage,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import { useParams } from "react-router-dom";
import * as Yup from "yup";
import { useCreateVariation } from "../../apis/queries/useCreateVariation";
import { CreateVariationType } from "../../apis/variation-service";

const regexNumberPattern = /^[0-9]+$/;

const validationSchema = Yup.object().shape({
  size: Yup.string().required("Size là bắt buộc"),
  availableQuantity: Yup.number()
    .required("Số lượng phẩm là bắt buộc")
    .positive("Số lượng phẩm phải lớn hơn 0"),
  unitPrice: Yup.number()
    .required("Giá gốc là bắt buộc")
    .positive("Giá sản phẩm phải lớn hơn 0"),
});

const initialValues: CreateVariationType = {
  size: "",
  availableQuantity: undefined,
  unitPrice: undefined,
  salePrice: undefined,
  productId: "",
};

export function AddVariationModalButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { id } = useParams();
  const createVariationMutation = useCreateVariation(id as string);

  const { values, errors, setFieldValue, resetForm, handleSubmit } = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      const valuesToSubmit: CreateVariationType = {
        productId: id as string,
        salePrice:
          values.salePrice !== undefined
            ? Number(values.salePrice)
            : Number(values.unitPrice),
        size: String(values.size),
        availableQuantity: Number(values.availableQuantity),
        unitPrice: Number(values.unitPrice),
      };
      createVariationMutation.mutate(valuesToSubmit);
      resetForm();
      onClose();
    },
  });
  return (
    <>
      <Button colorScheme="teal" onClick={onOpen}>
        Thêm mới
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <form onSubmit={handleSubmit}>
          <ModalContent>
            <ModalHeader>Thêm mới biến thể</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <FormControl className="mb-5" isInvalid={!!errors.size}>
                <FormLabel>Size</FormLabel>
                <Input
                  value={values.size}
                  onChange={(e) => {
                    if (!e.target.value.match(regexNumberPattern)) return;
                    setFieldValue("size", e.target.value);
                  }}
                />
                <FormErrorMessage>{errors.size}</FormErrorMessage>
              </FormControl>
              <FormControl
                className="mb-5"
                isInvalid={!!errors.availableQuantity}
              >
                <FormLabel>Số lượng</FormLabel>
                <Input
                  value={values.availableQuantity}
                  onChange={(e) => {
                    if (!e.target.value.match(regexNumberPattern)) return;
                    setFieldValue("availableQuantity", e.target.value);
                  }}
                />
                <FormErrorMessage>{errors.availableQuantity}</FormErrorMessage>
              </FormControl>
              <FormControl className="mb-5" isInvalid={!!errors.unitPrice}>
                <FormLabel>Giá gốc</FormLabel>
                <Input
                  value={values.unitPrice}
                  onChange={(e) => {
                    if (!e.target.value.match(regexNumberPattern)) return;
                    setFieldValue("unitPrice", e.target.value);
                  }}
                />
                <FormErrorMessage>{errors.unitPrice}</FormErrorMessage>
              </FormControl>
              <FormControl className="mb-5">
                <FormLabel>Giá bán</FormLabel>
                <Input
                  value={values.salePrice}
                  onChange={(e) => {
                    if (!e.target.value.match(regexNumberPattern)) return;
                    setFieldValue("salePrice", e.target.value);
                  }}
                />
                <FormHelperText>
                  Giá bán sẽ bằng giá gốc nếu không nhập
                </FormHelperText>
              </FormControl>
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onClose}>
                Close
              </Button>
              <Button
                colorScheme="teal"
                isLoading={createVariationMutation.isPending}
                isDisabled={
                  !!errors.availableQuantity ||
                  !!errors.unitPrice ||
                  !!errors.size ||
                  JSON.stringify(initialValues) === JSON.stringify(values)
                }
                type="submit"
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </form>
      </Modal>
    </>
  );
}
