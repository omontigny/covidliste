require "rails_helper"

describe SendVaccinationCenterConfirmationEmailJob do
  let!(:partner) { create(:partner) }
  let!(:vaccination_center) { create(:vaccination_center, partner: partner) }

  subject { SendVaccinationCenterConfirmationEmailJob.new.perform(vaccination_center.id) }

  context "vaccination center is confirmed by a volunteer" do
    it "sends the email" do
      mail = double(:mail)
      allow(VaccinationCenterMailer).to receive_message_chain("with.confirmed_vaccination_center_instructions").and_return(mail)
      expect(mail).to receive(:deliver_now)
      subject
    end

    it "set mail_sent_at" do
      subject
      expect(vaccination_center.reload.mail_sent_at).to_not be(nil)
    end
  end
end
