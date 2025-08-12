import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    Modal,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import { colors } from '../common/theme';
import i18n from 'i18n-js';
import { Input } from 'react-native-elements';
import RadioForm, { RadioButton, RadioButtonInput, RadioButtonLabel } from 'react-native-simple-radio-button';
import Button from '../components/Button';
import OtherPerson from './OtherPerson';
import { api } from 'common';
export const MAIN_COLOR = colors.BIDTAXIPRIMARY;
export const MAIN_COLOR_DARK = colors.BIDTAXIPRIMARYDARK;
import { fonts } from '../common/font';

export default function DeliveryModal(props) {
    const { t } = i18n;
    const isRTL = i18n.locale.indexOf('he') === 0 || i18n.locale.indexOf('ar') === 0;
    const { formatNumberInput, parseNumberInput, handleVietnameseNumberInput } = api;

    const { bookingModalStatus, onPressCancel, bookNow, tripInstructions, setTripInstructions, roundTrip, setRoundTrip, payment_mode, setPaymentMode, radioProps, profileData, setProfileData, auth, bookModelLoading, instructionData, setInstructionData, otherPerson, setOtherPerson, offerFare, setOfferFare, estimate, minimumPrice, settings, mode, formatAmount } = props;

    // Vietnamese number input support for offer fare
    const isVietnamese = settings?.country === "Vietnam";
    const displayOfferFare = isVietnamese && offerFare ? formatNumberInput(offerFare, true) : offerFare;

    const handleOfferFareChange = (text) => {
        if (isVietnamese) {
            handleVietnameseNumberInput(text, (numericValue, displayValue) => {
                setOfferFare(numericValue.toString());
            });
        } else {
            setOfferFare(text);
        }
    };

    return (
        <Modal
            animationType="fade"
            transparent={true}
            visible={bookingModalStatus}
        >
            <View style={styles.centeredView}>
                <KeyboardAvoidingView style={styles.form} behavior={Platform.OS == "ios" ? "padding" : (__DEV__ ? null : "padding")}>
                    <View style={[styles.modalView, { backgroundColor: mode === 'dark' ? colors.PAGEBACK : colors.WHITE }]}>
                        <View style={{ marginTop: auth && auth.profile && auth.profile.firstName && auth.profile.email ? 0 : 10, marginBottom: 10, width: '100%' }}>
                            {auth && auth.profile && !auth.profile.firstName ?
                                <View style={styles.textInputContainerStyle}>
                                    <Input
                                        editable={true}
                                        underlineColorAndroid={colors.TRANSPARENT}
                                        placeholder={t('first_name_placeholder')}
                                        placeholderTextColor={colors.SHADOW}
                                        value={profileData.firstName}
                                        keyboardType={'email-address'}
                                        inputStyle={[styles.inputTextStyle, { textAlign: isRTL ? "right" : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                                        onChangeText={(text) => { setProfileData({ ...profileData, firstName: text }) }}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                    />
                                </View>
                                : null}
                            {auth && auth.profile && !auth.profile.lastName ?
                                <View style={styles.textInputContainerStyle}>
                                    <Input
                                        editable={true}
                                        underlineColorAndroid={colors.TRANSPARENT}
                                        placeholder={t('last_name_placeholder')}
                                        placeholderTextColor={colors.SHADOW}
                                        value={profileData.lastName}
                                        keyboardType={'email-address'}
                                        inputStyle={[styles.inputTextStyle, { textAlign: isRTL ? "right" : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                                        onChangeText={(text) => { setProfileData({ ...profileData, lastName: text }) }}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                    />
                                </View>
                                : null}
                            {auth && auth.profile && !auth.profile.email ?
                                <View style={styles.textInputContainerStyle}>
                                    <Input
                                        editable={true}
                                        underlineColorAndroid={colors.TRANSPARENT}
                                        placeholder={t('email_placeholder')}
                                        placeholderTextColor={colors.SHADOW}
                                        value={profileData.email}
                                        keyboardType={'email-address'}
                                        inputStyle={[styles.inputTextStyle, { textAlign: isRTL ? "right" : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                                        onChangeText={(text) => { setProfileData({ ...profileData, email: text }) }}
                                        inputContainerStyle={styles.inputContainerStyle}
                                        containerStyle={styles.textInputStyle}
                                        autoCapitalize='none'
                                    />
                                </View>
                                : null}

                            <OtherPerson
                                otherPerson={otherPerson}
                                setOtherPerson={setOtherPerson}
                                setInstructionData={setInstructionData}
                                instructionData={instructionData}
                                auth={auth}
                                mode={mode}
                            />

                            <Text style={{ color: mode === 'dark' ? colors.WHITE : colors.BLACK, fontFamily: fonts.Bold, fontSize: 16, textAlign: isRTL ? 'right' : 'left', marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }}>{t('roundTrip')}</Text>
                            <RadioForm
                                initial={0}
                                formHorizontal={true}
                                labelHorizontal={false}
                                buttonColor={mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR}
                                labelColor={colors.SHADOW}
                                style={{ marginTop: 10 }}
                                labelStyle={{ marginLeft: 0 }}
                                selectedButtonColor={colors.HEADER}
                                selectedLabelColor={colors.HEADER}
                            >
                                <RadioButton labelHorizontal={true} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginLeft: isRTL ? 0 : 10, marginRight: isRTL ? 10 : 0 }}>
                                    <RadioButtonInput
                                        obj={{ label: t('yes'), value: 1 }}
                                        isSelected={roundTrip}
                                        onPress={() => setRoundTrip(true)}
                                        buttonSize={15}
                                        buttonOuterSize={26}
                                        buttonWrapStyle={{ marginLeft: 10 }}
                                        buttonColor={mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR}
                                    />
                                    <RadioButtonLabel
                                        obj={{ label: t('yes'), value: 1 }}
                                        labelHorizontal={true}
                                        onPress={() => setRoundTrip(true)}
                                        selectedLabelColor={colors.SHADOW}
                                        labelColor={mode === 'dark' ? colors.WHITE : colors.BLACK}
                                        labelStyle={{ fontFamily: fonts.Regular }}
                                        abelColor={mode === 'dark' ? colors.WHITE : colors.BLACK}
                                    />
                                </RadioButton>
                                <RadioButton labelHorizontal={true} style={{ flexDirection: isRTL ? 'row-reverse' : 'row', marginLeft: isRTL ? 0 : 20, marginRight: isRTL ? 20 : 0 }}>
                                    <RadioButtonInput
                                        obj={{ label: t('no'), value: 0 }}
                                        isSelected={!roundTrip}
                                        onPress={() => setRoundTrip(false)}
                                        buttonSize={15}
                                        buttonOuterSize={26}
                                        buttonWrapStyle={{ marginLeft: 10 }}
                                        buttonColor={mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR}
                                        selectedButtonColor={colors.HEADER}
                                    />
                                    <RadioButtonLabel
                                        obj={{ label: t('no'), value: 0 }}
                                        labelHorizontal={true}
                                        onPress={() => setRoundTrip(false)}
                                        selectedLabelColor={colors.SHADOW}
                                        labelColor={mode === 'dark' ? colors.WHITE : colors.BLACK}
                                        labelStyle={{ fontFamily: fonts.Regular }}
                                        abelColor={mode === 'dark' ? colors.WHITE : colors.BLACK}
                                    />
                                </RadioButton>
                            </RadioForm>
                        </View>
                        <View style={styles.textInputContainerStyle}>
                            <Input
                                editable={true}
                                underlineColorAndroid={colors.TRANSPARENT}
                                placeholder={t('tripInstructions')}
                                placeholderTextColor={colors.SHADOW}
                                value={tripInstructions}
                                keyboardType={'email-address'}
                                inputStyle={[styles.inputTextStyle, { textAlign: isRTL ? "right" : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                                onChangeText={(text) => { setTripInstructions(text) }}
                                inputContainerStyle={styles.inputContainerStyle}
                                containerStyle={styles.textInputStyle}
                            />
                        </View>
                        <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row', width: '100%' }]}>
                            <Text style={{ fontSize: 18, paddingLeft: 10, paddingBottom: 15, fontFamily: fonts.Regular, color: mode === 'dark' ? colors.WHITE : colors.BLACK }}>{t('payment_mode')}</Text>
                        </View>
                        <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row', width: '100%' }]}>
                            <RadioForm
                                radio_props={radioProps}
                                initial={payment_mode}
                                animation={false}
                                formHorizontal={true}
                                labelHorizontal={true}
                                buttonColor={mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR}
                                buttonSize={15}
                                buttonOuterSize={26}
                                buttonWrapStyle={{ marginLeft: 10 }}
                                labelColor={colors.HEADER}
                                style={[{ marginBottom: 20 }, isRTL ? { marginRight: 10 } : { marginLeft: 10 }]}
                                labelStyle={[isRTL ? { marginRight: 10 } : { marginRight: 10 }, { fontFamily: fonts.Regular, color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                                selectedButtonColor={mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR}
                                selectedLabelColor={colors.HEADER}
                                onPress={(value) => {
                                    setPaymentMode(value);
                                }}
                            />
                        </View>
                        {settings && !settings.coustomerBidPrice ?
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center' }}>
                                <Text style={{ fontSize: 16, fontFamily: fonts.Bold, marginBottom: 5, textAlign: 'center', color: mode === 'dark' ? colors.WHITE : colors.BLACK }}>{t('offer_your_fare')}</Text>
                                <View style={[styles.textInputContainerStyle, { flexDirection: isRTL ? 'row-reverse' : 'row', borderWidth: 2, borderColor: mode === 'dark' ? MAIN_COLOR_DARK : MAIN_COLOR, borderRadius: 10 }]}>
                                    <Text style={[{ color: mode === 'dark' ? colors.WHITE : colors.BLACK }, isRTL ? { fontSize: 20, paddingRight: 12 } : { fontSize: 20, paddingLeft: 12 }]}>{settings.symbol}</Text>
                                    <Input
                                        editable={true}
                                        underlineColorAndroid={colors.TRANSPARENT}
                                        placeholder={t('your_offer')}
                                        placeholderTextColor={colors.SHADOW}
                                        value={isVietnamese ? displayOfferFare : offerFare}
                                        keyboardType={isVietnamese ? 'default' : 'numeric'}
                                        inputStyle={[styles.inputTextStyle, { textAlign: isRTL ? "right" : 'left', color: mode === 'dark' ? colors.WHITE : colors.BLACK }]}
                                        onChangeText={handleOfferFareChange}
                                        inputContainerStyle={[styles.inputContainerStyle, { borderBottomWidth: 0, height: 50, }]}
                                        containerStyle={[styles.textInputStyle, { marginBottom: -25, width: '45%', }]}
                                    />
                                </View>
                                {parseFloat(minimumPrice) >= offerFare && offerFare > 0 ?
                                    <View style={{ paddingHorizontal: 10, marginBottom: 15, marginTop: 5 }}>
                                        <Text style={[isRTL ? {} : { color: colors.RED }]}>{t('minimum_price')}: {formatAmount(minimumPrice, settings.decimal, settings.country)}</Text>
                                    </View>
                                    :
                                    <View style={{ paddingHorizontal: 10, marginBottom: 15, marginTop: 5 }}>
                                        <Text style={{ color: mode === 'dark' ? colors.WHITE : colors.BLACK }}>*{t('recomendet_price')}: {estimate ? formatAmount(estimate.estimateFare, settings.decimal, settings.country) : null}</Text>
                                    </View>
                                }
                            </View> : null}
                        <View style={{ flexDirection: isRTL ? 'row-reverse' : 'row', alignSelf: 'center' }}>
                            <Button
                                title={t('cancel')}
                                loading={false}
                                loadingColor={{ color: colors.WHITE }}
                                buttonStyle={[styles.modalButtonTextStyle]}
                                style={[styles.modalButtonStyle, { backgroundColor: colors.RED, margin: 3 }]}
                                btnClick={onPressCancel}
                            />

                            <Button
                                title={t('confirm')}
                                loading={bookModelLoading}
                                loadingColor={{ color: colors.WHITE }}
                                buttonStyle={[styles.modalButtonTextStyle]}
                                style={[styles.modalButtonStyle, { backgroundColor: colors.GREEN, margin: 3 }]}
                                btnClick={bookNow}
                            />
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </View>
        </Modal>
    );

}

const styles = StyleSheet.create({
    centeredView: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: colors.BACKGROUND
    },
    modalView: {
        margin: 10,
        borderRadius: 10,
        padding: 15,
        alignItems: "flex-start",
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    textInputContainerStyle: {
        flexDirection: 'row',
        alignItems: "center"
    },
    inputContainerStyle: {
        borderBottomWidth: 1,
        borderBottomColor: colors.WHITE
    },
    textInputStyle: {
    },
    modalButtonStyle: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.SHADOW,
        width: 100,
        height: 50,
        elevation: 0,
        borderRadius: 10
    },
    modalButtonTextStyle: {
        color: colors.WHITE,
        fontFamily: fonts.Bold,
        fontSize: 18
    },
    rateViewStyle: {
        alignItems: 'center',
        alignSelf: 'center',
        marginBottom: 15
    },
    inputTextStyle: {
        fontFamily: fonts.Regular
    }
});