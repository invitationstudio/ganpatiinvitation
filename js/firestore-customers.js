import {
    db,
    collection,
    getDocs,
    getDoc,
    doc,
    setDoc,
    deleteDoc
} from "./firebase.js";

export async function getCustomers() {

    const customers = [];

    const snapshot = await getDocs(
        collection(db, "customers")
    );

    snapshot.forEach((docSnap) => {

        customers.push({
            id: docSnap.id,
            ...docSnap.data()
        });

    });

    return customers;

}

export async function saveCustomer(customer) {

    await setDoc(
        doc(db, "customers", customer.id),
        customer
    );

}

export async function deleteCustomer(id) {

    await deleteDoc(
        doc(db, "customers", id)
    );

}

export async function getInvitation(customerId) {

    const snapshot = await getDoc(
        doc(db, "customers", customerId)
    );

    if (!snapshot.exists()) {
        return null;
    }

    return {
        id: snapshot.id,
        ...snapshot.data()
    };

}

export async function saveInvitation(invitation) {

    await setDoc(
        doc(db, "customers", invitation.id),
        invitation,
        {
            merge: true
        }
    );

}

export async function uploadToCloudinary(file) {

    const formData = new FormData();

    formData.append("file", file);
    formData.append("upload_preset", "ganpaticms");

    const response = await fetch(
        "https://api.cloudinary.com/v1_1/rtl7cgk6/auto/upload",
        {
            method: "POST",
            body: formData
        }
    );

    if (!response.ok) {
        throw new Error("Upload Failed");
    }

    const data = await response.json();

    return data.secure_url;

}