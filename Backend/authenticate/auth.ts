import bcrypt from "bcryptjs";
const saltRounds: number = 10;

export const hashPassword = (password: string): string => {
    const salt = bcrypt.genSaltSync(saltRounds);
    const hashedPassword = bcrypt.hashSync(password, salt);

    if (hashedPassword) {
        return hashedPassword;
    } else {
        throw new Error('Error hashing the password');
    }

};

export const comparePasswords = (password: string, hashedPassword: string):Promise <boolean>  => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, hashedPassword, (err, result) => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};

