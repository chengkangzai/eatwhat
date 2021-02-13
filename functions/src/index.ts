import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

exports.addMaster = functions.region('asia-northeast3').https
    .onCall(async (data, context) => {
        if (context.auth?.token.isMaster !== true) {
            return {
                error: 'Damn you are not Master how can you add Master la',
            };
        }
        const email = data.email;
        return grantMasterRole(email).then(() => {
            return {
                message: `Done ! ${email} is Master now`,
            };
        });
    });

async function grantMasterRole(email: string): Promise<void> {
    const user = await admin.auth().getUserByEmail(email);
    if (user.customClaims && (user.customClaims as any).isMaster === true) {
        return;
    }
    return admin.auth().setCustomUserClaims(user.uid, {
        isMaster: true,
    });
}
