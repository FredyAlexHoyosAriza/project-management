import {
  ICreateEnrollment,
  IUpdateEnrollment,
} from "@/api/database/models/enrollment";

export const handleAcceptance = async (
  input: ICreateEnrollment | IUpdateEnrollment,
  isCreating: boolean
) => {
  if (input.isAccepted === true) {
    // Asigna un objeto Date con la fecha y hora actuales
    const entryDate = new Date();
    //Se requiere que exista entryDate para definir exitDate
    if (input.exitDate) {
      //input.exitDate llega en formato string
      const exitDate = new Date(input.exitDate);
      if (exitDate.getTime() > entryDate.getTime()) input.exitDate = exitDate;
      else {
        throw new Error("The exitDate must be greater than the entryDate");
      }
    }
    return { ...input, entryDate };
  } else if (isCreating) {
    if (input.exitDate) {
      throw new Error("Requires to be accepted to define exitDate");
    }
  } else if (!isCreating) {
    if (input.isAccepted === false) {
      if (input.exitDate) {
        throw new Error("Requires to be accepted to define exitDate");
      }
      return { ...input, entryDate: null, exitDate: null };
    }
  }
  //Para actualizar solo exitDate el front es quien garantiza exitDate > startDate
  return input;
};
